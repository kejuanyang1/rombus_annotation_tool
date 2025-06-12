(define (problem 33_0-goal)
  (:domain gripper-strips)
  (:objects
    other_01 - item
    other_02 - item
    other_03 - item
    other_04 - item
    container_03 - container
    container_06 - container
  )
  (:init
    (in other_03 container_03)
    (in other_04 container_03)
    (in other_02 container_06)
    (in other_01 container_06)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
