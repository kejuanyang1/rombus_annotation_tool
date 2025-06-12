(define (problem 29_0-goal)
  (:domain gripper-strips)
  (:objects
    office_02 - item
    office_07 - item
    container_05 - container
    container_06 - container
  )
  (:init
    (in office_07 container_06)
    (in office_02 container_05)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
