(define (problem 31_1-goal)
  (:domain gripper-strips)
  (:objects
    office_02 - item
    office_04 - item
    office_05 - item
    office_10 - item
    container_05 - container
  )
  (:init
    (in office_05 container_05)
    (in office_10 container_05)
    (in office_04 container_05)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
