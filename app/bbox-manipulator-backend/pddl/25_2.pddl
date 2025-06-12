(define (problem 25_2-goal)
  (:domain gripper-strips)
  (:objects
    office_02 - item
    office_05 - item
    office_08 - item
    container_05 - container
  )
  (:init
    (in office_08 container_05)
    (in office_05 container_05)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
